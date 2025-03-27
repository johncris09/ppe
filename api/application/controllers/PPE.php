<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class PPE extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('PPEModel');
		$this->load->model('AccountableOfficerModel');
		$this->load->model('EquipmentTypeModel');



	}

	public function index_get()
	{
		$ppeModel = new PPEModel;
		$result = $ppeModel->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{

		$ppeModel = new PPEModel;
		$result = $ppeModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$ppeModel = new PPEModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'equipment_type' => $requestData['equipment_type'],
			'accountable_officer' => $requestData['accountable_officer'],
			'article' => $requestData['article'],
			'description' => $requestData['description'],
			'date_acquired' => $requestData['date_acquired'],
			'stock_number' => $requestData['stock_number'],
			'unit' => $requestData['unit'],
			'value' => $requestData['value'],
			'balance_per_card' => $requestData['balance_per_card'],
			'onhand_per_count' => $requestData['onhand_per_count'],
			'shortage_quantity' => $requestData['shortage_quantity'],
			'storage_value' => $requestData['storage_value'],
			'end_user' => $requestData['end_user'],
			'remarks' => $requestData['remarks'],
			'encoded_by' => $requestData['encoded_by'],
		);

		$result = $ppeModel->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new user.'
			], RestController::HTTP_OK);
		}
	}

	public function update_put($id)
	{


		$ppeModel = new PPEModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		if (isset($requestData['equipment_type'])) {
			$data['equipment_type'] = $requestData['equipment_type'];
		}
		if (isset($requestData['accountable_officer'])) {
			$data['accountable_officer'] = $requestData['accountable_officer'];
		}
		if (isset($requestData['article'])) {
			$data['article'] = $requestData['article'];
		}
		if (isset($requestData['description'])) {
			$data['description'] = $requestData['description'];
		}
		if (isset($requestData['date_acquired'])) {
			$data['date_acquired'] = $requestData['date_acquired'];
		}
		if (isset($requestData['stock_number'])) {
			$data['stock_number'] = $requestData['stock_number'];
		}
		if (isset($requestData['unit'])) {
			$data['unit'] = $requestData['unit'];
		}
		if (isset($requestData['value'])) {
			$data['value'] = $requestData['value'];
		}
		if (isset($requestData['balance_per_card'])) {
			$data['balance_per_card'] = $requestData['balance_per_card'];
		}
		if (isset($requestData['onhand_per_count'])) {
			$data['onhand_per_count'] = $requestData['onhand_per_count'];
		}
		if (isset($requestData['shortage_quantity'])) {
			$data['shortage_quantity'] = $requestData['shortage_quantity'];
		}
		if (isset($requestData['storage_value'])) {
			$data['storage_value'] = $requestData['storage_value'];
		}
		if (isset($requestData['end_user'])) {
			$data['end_user'] = $requestData['end_user'];
		}
		if (isset($requestData['remarks'])) {
			$data['remarks'] = $requestData['remarks'];
		}

		$update_result = $ppeModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_OK);

		}
	}


	public function delete_delete($id)
	{
		$ppeModel = new PPEModel;
		$result = $ppeModel->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}
	public function get_report_get()
	{
		$ppeModel = new PPEModel;
		$accountableOfficerModel = new AccountableOfficerModel;
		$equipmentTypeModel = new EquipmentTypeModel;

		$requestData = $this->input->get();
		$resultData = [];
		$data = [];
		$asOf  = "";
		if (isset($requestData['date'])) {
			$asOf = $requestData['date'];
		}
		if (isset($requestData['office'])) {
			$data['office.id'] = $requestData['office'];
		}
		if (isset($requestData['accountable_officer'])) {
			$data['accountable_officer.id'] = $requestData['accountable_officer'];
		}


		// Get the accountable officer
		$accountable_officer = $accountableOfficerModel->get_accountable_officers_office($data);

		if ($accountable_officer) {
			$accountable_officer_id = $accountable_officer->id;



			// Get unique equipment types for the office
			$office_equipment_types = $ppeModel->get_office_equipment_type([
				'accountable_officer' => $accountable_officer_id
			]);

			if (!empty($office_equipment_types)) {
				foreach ($office_equipment_types as $office_equipment_type) {
					// Get equipment type info
					$equipment_type = $equipmentTypeModel->find($office_equipment_type->equipment_type);


					if ($equipment_type) {
						$equipment_type_id = $equipment_type->id; // Use a unique identifier

						// Initialize array if not set
						if (!isset($resultData[$equipment_type_id])) {
							$resultData[$equipment_type_id] = [
								'equipment_type' => $equipment_type->equipment_type, // Use name for readability
								'code' => $equipment_type->code,
								'accountable_officer_last_name' => $accountable_officer->last_name,
								'accountable_officer_first_name' => $accountable_officer->first_name,
								'accountable_officer_middle_name' => $accountable_officer->middle_name,
								'accountable_officer_suffix' => $accountable_officer->suffix,
								'accountable_officer_designation' => $accountable_officer->designation,
								'accountable_officer_title' => $accountable_officer->title,
								'accountable_officer_credentials' => $accountable_officer->credentials,
								'accountable_officer_office' => $accountable_officer->office,
								'accountable_officer_abbr' => $accountable_officer->abbr,
								'accountable_officer_assumption_date' => date('F d, Y', strtotime($accountable_officer->assumption_date)),
								'items' => []
							];
						}

						// Fetch items under this equipment type
						$items = $ppeModel->get_item([
							'ppe.equipment_Type' => $equipment_type_id,
							'ppe.accountable_officer' => $accountable_officer_id,
						]);

						if (!empty($items)) {
							foreach ($items as $item) {
								$resultData[$equipment_type_id]['items'][] = $item;
							}
						}
					}
				}
			} else {
				$resultData = [];
			}

		} else {
			$resultData = [];
		}

		// $this->response($resultData, RestController::HTTP_OK);
		$result = [];

		foreach ($resultData as $equipment) {
			$accountable_officer = trim(
				($equipment['accountable_officer_title'] ?? '') . ' ' .
				($equipment['accountable_officer_last_name'] ?? '') . ' ' .
				($equipment['accountable_officer_middle_name'] ?? '') . ' ' .
				($equipment['accountable_officer_first_name'] ?? '') . ' ' .
				($equipment['accountable_officer_suffix'] ?? '') . ' ' .
				($equipment['accountable_officer_designation'] ?? '')
			);


			$equipmentData = (object) [
				"equipment_type" => $this->shortenSheetName($equipment["equipment_type"] . " " . $equipment["code"]),
				"items" => []
			];

			$currentPageItems = [];
			$rowCount = 0;

			foreach ($equipment["items"] as $item) {

				$descriptionLines = substr_count($item->description, "\n") + 1; // Count new lines
       
				$currentPageItems[] = (object) [
					"article" => $item->article,
					"description" => $item->description,
					"date_acquired" => $item->date_acquired,
					"stock_number" => $item->stock_number,
					"unit" => $item->unit,
					"value" => $item->value,
					"balance_per_card" => $item->balance_per_card,
					"onhand_per_count" => $item->onhand_per_count,
					"shortage_quantity" => $item->shortage_quantity,
					"storage_value" => $item->storage_value,
					"end_user" => $item->end_user,
					"remarks" => $item->remarks,
					"encoded_by" => $item->encoded_by,
					"equipment_type_id" => $item->equipment_type_id,
					"equipment_type" => $item->equipment_type,
					"code" => $item->code,
					"accountable_officer_id" => $item->accountable_officer_id,
					"accountable_officer_last_name" => $item->accountable_officer_last_name,
					"accountable_officer_first_name" => $item->accountable_officer_first_name,
					"accountable_officer_middle_name" => $item->accountable_officer_middle_name,
					"accountable_officer_suffix" => $item->accountable_officer_suffix,
					"assumption_date" => $item->assumption_date,
					"designation" => $item->designation,
					"title" => $item->title,
					"credentials" => $item->credentials,
					"office_id" => $item->office_id,
					"abbr" => $item->abbr,
					"office" => $item->office
				];
				$rowCount += $descriptionLines; // Increment row count by new line count
        

				// Create a new page when reaching 10 rows
				if ($rowCount >= 20) {
					$equipmentData->items[] = [
						"pageInformation" => [
							(object) [
								"title" => "REPORT ON THE PHYSICAL COUNT OF PROPERTY, PLANT AND EQUIPMENT",
								"annex" => "ANNEX 49",
								"equipmentType" => $equipment["equipment_type"] . " " . $equipment["code"],
								"typeTitle" => '(Type of Property, Plant and Equipment)',
								"asOf" => date('F d, Y', strtotime( $asOf)) ,
								"dateAssumption" => $equipment['accountable_officer_assumption_date'],
								"office" => $equipment['accountable_officer_office'],
								"accountableOfficer" => $accountable_officer,
							]
						],
						"equipments" => $currentPageItems
					];
					$currentPageItems = [];
					$rowCount = 0;
				}
			}

			// Add any remaining items to the last page
			if (!empty($currentPageItems)) {
				$equipmentData->items[] = [
					"pageInformation" => [
						(object) [
							"title" => "REPORT ON THE PHYSICAL COUNT OF PROPERTY, PLANT AND EQUIPMENT",
							"annex" => "ANNEX 49",
							"equipmentType" => $equipment["equipment_type"] . " " . $equipment["code"],
							"typeTitle" => '(Type of Property, Plant and Equipment)',
							"asOf" => date('F d, Y', strtotime( $asOf)) ,
								"dateAssumption" => $equipment['accountable_officer_assumption_date'],
							"office" => $equipment['accountable_officer_office'],
							"accountableOfficer" => $accountable_officer,
						]
					],
					"equipments" => $currentPageItems
				];
			}

			$result[] = $equipmentData;
		}

		// echo json_encode($result, JSON_PRETTY_PRINT);


		$this->response($result, RestController::HTTP_OK);
	}
	function shortenSheetName($name, $maxLength = 31)
	{
		$abbreviations = [
			"INFORMATION" => "INFO",
			"COMMUNICATION" => "COMM",
			"TECHNOLOGY" => "TECH",
			"EQUIPMENTS" => "EQPT",
			"AND" => "&"
		];

		// Replace words with abbreviations
		$words = explode(" ", $name);
		foreach ($words as &$word) {
			$upperWord = strtoupper($word);
			if (isset($abbreviations[$upperWord])) {
				$word = $abbreviations[$upperWord];
			}
		}
		$shortenedName = implode(" ", $words);

		// Trim if still longer than maxLength
		return (strlen($shortenedName) > $maxLength) ? substr($shortenedName, 0, $maxLength) : $shortenedName;
	}


}
