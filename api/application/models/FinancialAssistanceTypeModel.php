<?php

defined('BASEPATH') or exit('No direct script access allowed');

class FinancialAssistanceTypeModel extends CI_Model
{

	public $table = 'financial_assistance_type';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db
			->order_by('type')
			->get($this->table);
		return $query->result();

	}
	public function total()
	{
		$query = $this->db  
		    ->select('count(type) as total')
			->get($this->table); 

		
		if($query->row()->total){
			return $query->row();
		} 
		return ['total' => '0'];


	}

	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}


}
